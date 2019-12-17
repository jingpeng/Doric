#ifndef VIEW_NODE_H
#define VIEW_NODE_H

#include "context_holder.h"

using namespace std;

template <typename V>
class SuperNode;

template <class T>
class ViewNode : public ContextHolder {

protected:
    T view;

private:
    QString *id;

public:
    ViewNode(Context *context) : ContextHolder(context) {}
};

#endif // VIEW_NODE_H
